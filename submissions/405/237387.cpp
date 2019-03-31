//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

int main(){
	char a[][5] = {"I","II","III","IIII","V","VI","VII","VIII","IX","X","XI","XII"};
	char S1[5];
	int T;
	cin >> S1 >> T;
	rep(i, 12){
		if(strcmp(S1, a[i]) == 0){
			printf("%s\n", a[(1200 + i + T) % 12]);
		}
	}
	return 0;
}
