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

int a[10000];
int b[10000];
int n[1000];
int main(){
	int N;
	cin >> N;
	rep(i, N){
		cin >> a[i] >> b[i];
	}
	int M;
	cin >> M;
	rep(i, M){
		int x, y;
		cin >> x >> y;
		rep(j, N){
			if(x <= a[j] && b[j] <= y){
				n[i]++;
			}
		}
	}

	int mx = 0;
	rep(i, M){
		mx = max(mx, n[i]);
	}
	if(mx == 0){
		puts("0");
	}else{
		rep(i, M){
			if(n[i] == mx){
				printf("%d\n", i + 1);
			}
		}
	}
	return 0;
}
